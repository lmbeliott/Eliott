#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k;
    cin >> n >> k;
    vector<int> a(n);
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }
    vector<int> cpt(1001, 0);   // exemplaires de chaque valeur dans la fenêtre [g, d]
    int differentes = 0, g = 0, meilleure = 0, debut = 0;
    for (int d = 0; d < n; d++) {
        if (cpt[a[d]] == 0) {
            differentes++;
        }
        cpt[a[d]]++;
        while (differentes > k) {           // trop de valeurs : on avance le début
            cpt[a[g]]--;
            if (cpt[a[g]] == 0) {
                differentes--;
            }
            g++;
        }
        if (d - g + 1 > meilleure) {        // strictement plus longue : on garde la première
            meilleure = d - g + 1;
            debut = g;
        }
    }
    cout << meilleure << " " << debut + 1 << "\n";
    return 0;
}
