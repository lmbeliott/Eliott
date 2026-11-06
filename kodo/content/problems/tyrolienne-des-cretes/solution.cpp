#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k;
    string sentier;
    cin >> n >> k >> sentier;

    // vues[h + n] = nombre de bornes déjà rencontrées à l'altitude h (h entre -n et n)
    vector<long long> vues(2 * n + 1, 0);
    int altitude = 0;
    long long total = 0;
    for (int j = 0; j <= n; j++) {
        if (j > 0) {
            char pas = sentier[j - 1];
            if (pas == 'M') altitude++;
            else if (pas == 'D') altitude--;
        }
        // départs possibles : les bornes précédentes situées K mètres plus haut
        int depart = altitude + k;
        if (depart <= n) total += vues[depart + n];
        vues[altitude + n]++;
    }
    cout << total << "\n";
    return 0;
}
