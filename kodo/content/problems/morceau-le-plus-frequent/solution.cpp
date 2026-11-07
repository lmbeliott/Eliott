#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k;
    string s;
    cin >> n >> k >> s;

    map<string, int> compte;   // sous-chaîne de longueur k -> nombre d'apparitions
    for (int i = 0; i + k <= n; i++) {
        compte[s.substr(i, k)]++;
    }

    // la map est parcourue dans l'ordre alphabétique : en cas d'égalité, on garde la première
    string meilleur = "";
    int nb = 0;
    for (auto &e : compte) {
        if (e.second > nb) {
            meilleur = e.first;
            nb = e.second;
        }
    }
    cout << meilleur << " " << nb << "\n";
    return 0;
}
