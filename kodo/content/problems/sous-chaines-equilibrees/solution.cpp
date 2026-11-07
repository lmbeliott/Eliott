#include <iostream>
#include <string>
#include <vector>
#include <map>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k;
    string s;
    cin >> n >> k >> s;

    // ecart[c] = (nombre de lettres c) - (nombre de lettres a) dans le préfixe en cours.
    // Deux préfixes de même écart délimitent une sous-chaîne équilibrée.
    vector<int> ecart(k, 0);
    map<vector<int>, long long> vus;
    vus[ecart] = 1;              // le préfixe vide
    long long total = 0;
    for (char lettre : s) {
        int c = lettre - 'a';
        if (c == 0) {
            // un a de plus : tous les écarts diminuent de 1
            for (int i = 1; i < k; i++) ecart[i]--;
        } else {
            ecart[c]++;
        }
        long long& deja = vus[ecart];
        total += deja;           // chaque préfixe précédent de même écart donne une sous-chaîne
        deja++;
    }
    cout << total << "\n";
    return 0;
}
