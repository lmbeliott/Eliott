#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    vector<long long> pile;
    bool erreur = false;
    string e;
    while (cin >> e) {
        if (e == "+" || e == "-" || e == "*") {
            if (pile.size() < 2) {
                erreur = true;
                break;
            }
            long long b = pile.back();   // le haut de la pile est le second opérande
            pile.pop_back();
            long long a = pile.back();
            pile.pop_back();
            if (e == "+") {
                pile.push_back(a + b);
            } else if (e == "-") {
                pile.push_back(a - b);
            } else {
                pile.push_back(a * b);
            }
        } else {
            pile.push_back(stoll(e));
        }
    }
    if (erreur || pile.size() != 1) {
        cout << "ERREUR\n";
    } else {
        cout << pile[0] << "\n";
    }
    return 0;
}
