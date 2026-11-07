#include <algorithm>
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string s;
    cin >> s;
    int n = s.size();

    // t = #a#b#c# ; p[i] = rayon du plus long palindrome de t centré en i
    string t = "#";
    for (char ch : s) {
        t += ch;
        t += '#';
    }
    int m = t.size();
    vector<int> p(m, 0);
    int c = 0, d = 0;  // palindrome [c - p[c], d] qui va le plus loin à droite
    for (int i = 0; i < m; i++) {
        if (i < d) p[i] = min(d - i, p[2 * c - i]);
        while (i - p[i] - 1 >= 0 && i + p[i] + 1 < m && t[i - p[i] - 1] == t[i + p[i] + 1]) p[i]++;
        if (i + p[i] > d) {
            c = i;
            d = i + p[i];
        }
    }

    // fin[e] = plus long palindrome qui finit en e ; debut[x] = plus long qui commence en x
    vector<long long> fin(n, 1), debut(n, 1);
    for (int i = 0; i < m; i++) {
        int longueur = p[i];
        if (longueur > 0) {
            int x = (i - longueur) / 2;
            int e = x + longueur - 1;
            fin[e] = max(fin[e], (long long)longueur);
            debut[x] = max(debut[x], (long long)longueur);
        }
    }
    // Un palindrome qui finit en e + 1, raccourci d'une lettre de chaque côté, finit en e.
    for (int e = n - 2; e >= 0; e--) fin[e] = max(fin[e], fin[e + 1] - 2);
    for (int x = 1; x < n; x++) debut[x] = max(debut[x], debut[x - 1] - 2);

    // gauche[i] = meilleur palindrome dans s[0..i] ; droite[i] = meilleur dans s[i..n-1]
    vector<long long> gauche = fin, droite = debut;
    for (int i = 1; i < n; i++) gauche[i] = max(gauche[i], gauche[i - 1]);
    for (int i = n - 2; i >= 0; i--) droite[i] = max(droite[i], droite[i + 1]);

    long long meilleur = 0;
    for (int i = 0; i + 1 < n; i++) meilleur = max(meilleur, gauche[i] * droite[i + 1]);
    cout << meilleur << "\n";
    return 0;
}
